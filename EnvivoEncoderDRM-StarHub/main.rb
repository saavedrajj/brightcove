require 'json'
require 'ooyala-v2-api'
require 'optparse'

require_relative 'fairplay'
require_relative 'widevine_modular'

config_file = File.read('config.json')
config = JSON.parse(config_file)


options = {}
OptionParser.new do |opt|
    opt.on('--embed-code EMBEDCODE', 'Embed code to generate keys for') { |o| options[:embed_code] = o }
    opt.on('--name NAME', 'Name of remote asset to create') { |o| options[:name] = o }
    opt.on('--environment ENVIRONMENT', 'Environment to generate keys in') { |o| options[:environment] = o }
    opt.on('--hls HLS', 'HLS URL to post') { |o| options[:hls] = o }
    opt.on('--dash DASH', 'DASH URL to post') { |o| options[:dash] = o }
    opt.on('--h', 'Shows possible command line arguments') do 
        puts opt
        exit
    end
end.parse!

if options[:embed_code] and options[:name]
    puts "You must only supply one of embed-code or name"
    exit
end

if not options[:embed_code] and not options[:name]
    puts "You must supply either an embed code or name to generate keys"
    exit
end

apiOptions = {}
if options[:environment] and options[:environment] == "staging"
    apiOptions = {:base_url => "https://api-staging.ooyala.com", :cache_base_url => "https://api-staging.ooyala.com"}    
    config['key_server'] = "keyserver-staging.ooyala.com"
    puts "Making requests to staging environment"
else
    puts "Making requests to production environment"
end

api = Ooyala::API.new(config['api_key'], config['api_secret'], apiOptions)

embed_code = ""
if options[:embed_code]
    embed_code = options[:embed_code]
else
    asset = {
            :name => options[:name],
            :asset_type => "remote_asset",
            :is_live_stream => true
        }

    response = api.post('assets', asset)
    embed_code = response['embed_code']
    puts "Created a movie in Backlot with embed_code #{embed_code}"
end


fairplay_keys = Fairplay.new.request_key(api, embed_code)
puts
puts "----------------------------------------------------------------"
puts "Keys to use for HLS Fairplay: #{fairplay_keys}"
puts "----------------------------------------------------------------"
puts
puts

# Request keys for DASH CENC
wv_keys = WidevineModular.new.request_key(config['key_server'], 
                           config['wv_aes_key'], 
                           config['wv_aes_iv'], 
                           config['wv_provider_id'],
                           embed_code)

puts "If you are using other encoders for DASH CENC, you have to convert following values yourself:"
puts "Keys to use for DASH CENC: #{wv_keys}"
puts "----------------------------------------------------------------"


# Encode assets at this point with keys above

# After encoding, need to set the movie_urls on the asset
movie_urls = {}
post_urls = false
if options[:hls]
    movie_urls['hls'] = options[:hls]
    post_urls = true
end

if options[:dash]
    movie_urls['dash'] = options[:dash]
    post_urls = true
end

if post_urls
    api.post("assets/#{embed_code}/movie_urls", movie_urls)
    puts "Encoded URLs added to the movie"
end
