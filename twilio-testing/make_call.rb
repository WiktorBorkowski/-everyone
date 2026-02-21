#!/usr/bin/env ruby
# test_call.rb
require "twilio-ruby"

# Read credentials from environment variables (recommended)
account_sid = ENV.fetch("TWILIO_ACCOUNT_SID")
auth_token  = ENV.fetch("TWILIO_AUTH_TOKEN")

from_number = "+12345952379"            # your Twilio voice-capable number
to_number   = ENV.fetch("TEST_NUMBER")  # e.g. +491701234567

client = Twilio::REST::Client.new(account_sid, auth_token)

# When the call is answered, Twilio will fetch TwiML from this URL.
# This uses Twilio's demo TwiML that says a short message.
call = client.calls.create(
  from: from_number,
  to: to_number,
  url: "http://demo.twilio.com/docs/voice.xml"
)

puts "📞 Call initiated! SID: #{call.sid}"
puts "Status: #{call.status}"
