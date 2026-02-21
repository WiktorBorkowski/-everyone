# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...
# @everyone

A simple app that lets you quickly reach your trusted people in different situations (mental health, check-ins, other scenarios).

This repo contains the Ruby on Rails backend.

## What it does (backend)
- Stores users and their trusted contacts
- Starts a “session” when a user triggers @everyone
- Calls multiple contacts at once (first person to pick up gets connected)
- Sends SMS updates to the other contacts

## Tech
- Ruby on Rails (API / backend)
- Twilio (Voice + SMS)

## Requirements
- Ruby (match the version in `.ruby-version`)
- Bundler
- Twilio account + phone number

## Setup (local)

1. Install gems:
   `bundle install`
2. Create `.env` in the project root (already gitignored) with:
   `TWILIO_ACCOUNT_SID=your_sid`
   `TWILIO_AUTH_TOKEN=your_token`
   `TEST_NUMBER=+15551234567`
   `TWILIO_FROM_NUMBER=+15557654321`
3. Start the app:
   `bin/dev`

With `dotenv-rails` installed, Rails automatically loads `.env` in development and test.

## Database (SQLite)

This app uses SQLite in local development and test:
- `storage/development.sqlite3`
- `storage/test.sqlite3`

Prepare the DB:
- `bundle exec rails db:prepare`

Open a SQL shell (development):
- `sqlite3 storage/development.sqlite3`

Useful SQLite commands:
- `.tables`
- `.schema contacts`
- `.schema users`
- `.mode column`
- `.headers on`
- `.quit`

Example queries:

```sql
SELECT id, name, email FROM users;

SELECT id, user_id, name, phone_e164, tier, priority, active, consent_status
FROM contacts
ORDER BY tier ASC, priority ASC;

SELECT tier, COUNT(*) AS count
FROM contacts
WHERE active = 1
GROUP BY tier
ORDER BY tier ASC;
```

You can also use Rails runner for quick checks:
- `bundle exec rails runner 'puts Contact.where(active: true).order(:tier, :priority).pluck(:name, :phone_e164)'`
