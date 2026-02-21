class HomeController < ApplicationController
  def index; end

  def signup; end

  def initiate_call
    client = Twilio::REST::Client.new(
      ENV.fetch("TWILIO_ACCOUNT_SID"),
      ENV.fetch("TWILIO_AUTH_TOKEN")
    )

    call = client.calls.create(
      from: ENV.fetch("TWILIO_FROM_NUMBER"),
      to: ENV.fetch("TEST_NUMBER"),
      url: ENV.fetch("TWILIO_VOICE_URL", "http://demo.twilio.com/docs/voice.xml")
    )

    redirect_to root_path, notice: "Call initiated. SID: #{call.sid}"
  rescue KeyError => e
    redirect_to root_path, alert: "Missing environment variable: #{e.key}"
  rescue Twilio::REST::RestError => e
    redirect_to root_path, alert: "Twilio error: #{e.message}"
  end
end
