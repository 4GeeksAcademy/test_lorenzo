#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build
pip install pipenv
pipenv install

pipenv run upgrade

pipenv run python src/seed_campers.py
pipenv run python src/seed_vans.py