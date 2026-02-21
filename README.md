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

TODO
