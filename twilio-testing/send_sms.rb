#!/usr/bin/env ruby
# send_sms.rb
require "twilio-ruby"

# Read credentials from environment variables (recommended)
account_sid = ENV.fetch("TWILIO_ACCOUNT_SID")
auth_token  = ENV.fetch("TWILIO_AUTH_TOKEN")

from_number = "+12345952379" # e.g. +14155552671 (your Twilio number)
to_number   = ENV.fetch("TEST_NUMBER")   # e.g. +491701234567 (your phone)

message_body = ARGV.join(" ")
message_body = "Hello from Twilio + Ruby! #{Time.now}" if message_body.strip.empty?

client = Twilio::REST::Client.new(account_sid, auth_token)

message = client.messages.create(
  from: from_number,
  to: to_number,
  body: message_body
)

puts "✅ Sent! SID: #{message.sid}"
puts "Status: #{message.status}"
