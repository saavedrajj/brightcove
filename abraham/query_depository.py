queries = dict([
    ('acc_2540076170001_views_by_country', """
SELECT
  country_name,
  SUM(video_view) AS video_views
FROM
  `collector_logs.production_collector_logs_*`
WHERE
  (_TABLE_SUFFIX BETWEEN '%s'
    AND '%s')
  AND account = "2540076170001"
  AND video_view > 0
  AND DATE(TIMESTAMP_MILLIS(time+(%s)*60*60*1000))="%s"
GROUP BY
  country_name
ORDER BY
  video_views DESC
LIMIT
  10
    """),
    ('acc_2540076170001_views_by_domain', 
     """
SELECT
  destination_domain,
  SUM(video_view) AS video_views
FROM
  `collector_logs.production_collector_logs_*`
WHERE
  (_TABLE_SUFFIX BETWEEN '%s'
    AND '%s')
  AND account = "2540076170001"
  AND video_view > 0
  AND destination_domain IN ("www.express.co.uk",
    "www.dailystar.co.uk",
    "www.ok.co.uk",
    "www-express-co-uk.cdn.ampproject.org",
    "www-dailystar-co-uk.cdn.ampproject.org",
    "www-ok-co-uk.cdn.ampproject.org")
  AND DATE(TIMESTAMP_MILLIS(time+(%s)*60*60*1000))="%s"
GROUP BY
  destination_domain
ORDER BY
  video_views DESC
    """),
    ('acc_2540076170001_top_3_videos_by_domain', 
     """
WITH
  Q1 AS (
  SELECT
    destination_domain AS destination_domain,
    destination_path AS display_url,
    SUM(video_view) AS video_views,
    SUM(video_impression) AS video_impressions,
    ROUND(100*SUM(video_view)/SUM(video_impression),2) AS play_rate_pcnt,
    CAST(ROUND(SUM(video_seconds_viewed)/60,0) AS INT64) AS viewed_minutes,
    CAST(ROUND(SUM(video_percent_viewed)/SUM(video_view),0) AS INT64) AS engagement_score
  FROM
  `collector_logs.production_collector_logs_*`
  WHERE
  (_TABLE_SUFFIX BETWEEN '%s'
    AND '%s')
  AND account = "2540076170001"
  AND DATE(TIMESTAMP_MILLIS(time+(%s)*60*60*1000))="%s"
  GROUP BY
    destination_domain,
    display_url),
  Q2 AS (
  SELECT
    *
  FROM
    Q1
  WHERE
    destination_domain = "www.express.co.uk"
  ORDER BY
    video_views DESC
  LIMIT
    3 ),
  Q3 AS (
  SELECT
    *
  FROM
    Q1
  WHERE
    destination_domain = "www.dailystar.co.uk"
  ORDER BY
    video_views DESC
  LIMIT
    3 ),
  Q4 AS (
  SELECT
    *
  FROM
    Q1
  WHERE
    destination_domain = "www.ok.co.uk"
  ORDER BY
    video_views DESC
  LIMIT
    3 ),
  Q5 AS (
  SELECT
    *
  FROM
    Q1
  WHERE
    destination_domain = "www-express-co-uk.cdn.ampproject.org"
  ORDER BY
    video_views DESC
  LIMIT
    3 ),
  Q6 AS (
  SELECT
    *
  FROM
    Q1
  WHERE
    destination_domain = "www-dailystar-co-uk.cdn.ampproject.org"
  ORDER BY
    video_views DESC
  LIMIT
    3 ),
  Q7 AS (
  SELECT
    *
  FROM
    Q1
  WHERE
    destination_domain = "www-ok-co-uk.cdn.ampproject.org"
  ORDER BY
    video_views DESC
  LIMIT
    3 ),
  Q8 AS (
  SELECT
    *
  FROM ((
      SELECT
        *
      FROM
        Q2)
    UNION ALL (
      SELECT
        *
      FROM
        Q3)
    UNION ALL (
      SELECT
        *
      FROM
        Q4)
    UNION ALL (
      SELECT
        *
      FROM
        Q5)
    UNION ALL (
      SELECT
        *
      FROM
        Q6)
    UNION ALL (
      SELECT
        *
      FROM
        Q7)) )
SELECT
  CONCAT(destination_domain,display_url) AS display_url,
  video_views,
  video_impressions,
  play_rate_pcnt,
  viewed_minutes,
  engagement_score
FROM
  Q8
ORDER BY
  destination_domain DESC,
  video_views DESC
    """),
    ('next_interactive_medium_report_live_vs_vod', """
SELECT
  CASE
    WHEN (live_engagement_seconds > 0 OR most_frequent_video_duration IS NULL) THEN 'live'
    ELSE 'vod'
  END AS category,
  account,
  EXTRACT(ISOWEEK
  FROM
    DATE(TIMESTAMP(REPLACE(_TABLE_SUFFIX, '_','-')))) AS date_week,
  SUM(CASE
      WHEN device_type='desktop' THEN video_views
      ELSE 0 END) AS video_views_desktop,
  SUM(CASE
      WHEN device_type='mobile' AND platform NOT IN ('ios-native-sdk',  'android-native-sdk') THEN video_views
      ELSE 0 END) AS video_views_mobile_web,
  SUM(CASE
      WHEN device_type='mobile' AND platform IN ('ios-native-sdk',  'android-native-sdk') THEN video_views
      ELSE 0 END) AS video_views_mobile_app,
  SUM(CASE
      WHEN device_type='tablet' AND platform NOT IN ('ios-native-sdk',  'android-native-sdk') THEN video_views
      ELSE 0 END) AS video_views_tablet_web,
  SUM(CASE
      WHEN device_type='tablet' AND platform IN ('ios-native-sdk',  'android-native-sdk') THEN video_views
      ELSE 0 END) AS video_views_tablet_app,
  SUM(CASE
      WHEN device_type NOT IN ('desktop',  'mobile',  'tablet') THEN video_views
      ELSE 0 END) AS video_views_other,
  SUM(video_views) AS video_views_total
FROM
  `session_statistics.sessions_*`
WHERE
  (_TABLE_SUFFIX BETWEEN '%s' AND '%s')
  AND account IN ("876450612001",
    "876450610001",
    "876630703001",
    "854081247001",
    "1969646226001",
    "4005328962001",
    "5067014665001",
    "887906353001",
    "5132998232001")
  AND player NOT IN ("players.brightcove.com/876450610001/S1GsrMF0_default/Boost High-Tech",
    "players.brightcove.com/876450610001/S1GsrMF0_default/podcast",
    "players.brightcove.com/887906353001/HyLCBfFA_default/Boost e-sport",
    "players.brightcove.com/887906353001/HyLCBfFA_default/podcasts",
    "1234656107001")
GROUP BY
  category,
  account,
  date_week
ORDER BY
  category,
  account,
  date_week
    """),
    ('next_interactive_medium_report_videos', """
SELECT
  account,
  video,
  EXTRACT(ISOWEEK
  FROM
    DATE(TIMESTAMP(REPLACE(_TABLE_SUFFIX, '_','-')))) AS date_week,
  SUM(CASE
      WHEN device_type='desktop' THEN video_views
      ELSE 0 END) AS video_views_desktop,
  SUM(CASE
      WHEN device_type='mobile' AND platform NOT IN ('ios-native-sdk',  'android-native-sdk') THEN video_views
      ELSE 0 END) AS video_views_mobile_web,
  SUM(CASE
      WHEN device_type='mobile' AND platform IN ('ios-native-sdk',  'android-native-sdk') THEN video_views
      ELSE 0 END) AS video_views_mobile_app,
  SUM(CASE
      WHEN device_type='tablet' AND platform NOT IN ('ios-native-sdk',  'android-native-sdk') THEN video_views
      ELSE 0 END) AS video_views_tablet_web,
  SUM(CASE
      WHEN device_type='tablet' AND platform IN ('ios-native-sdk',  'android-native-sdk') THEN video_views
      ELSE 0 END) AS video_views_tablet_app,
  SUM(CASE
      WHEN device_type NOT IN ('desktop',  'mobile',  'tablet') THEN video_views
      ELSE 0 END) AS video_views_other,
  SUM(video_views) AS video_views_total
FROM
  `session_statistics.sessions_*`
WHERE
  (_TABLE_SUFFIX BETWEEN '%s' AND '%s')
  AND account IN ("876450612001",
    "876450610001",
    "876630703001",
    "854081247001",
    "1969646226001",
    "4005328962001",
    "5067014665001",
    "887906353001",
    "5132998232001")
  AND player NOT IN ("players.brightcove.com/876450610001/S1GsrMF0_default/Boost High-Tech",
    "players.brightcove.com/876450610001/S1GsrMF0_default/podcast",
    "players.brightcove.com/887906353001/HyLCBfFA_default/Boost e-sport",
    "players.brightcove.com/887906353001/HyLCBfFA_default/podcasts",
    "1234656107001")
GROUP BY
  account,
  video,
  date_week
ORDER BY
  account,
  video,
  date_week
    """)
])