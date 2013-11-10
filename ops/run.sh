#!/bin/bash
set -e

cd /home/jon/pocketchange
. bin/activate

exec ./bin/gunicorn \
    -b 0.0.0.0:8002 \
    -w 10 \
    pocketchange.wsgi_production:application