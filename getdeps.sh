#! /bin/sh
# fetches the few and simple dependencies and avoids complicated frameworks

curl https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css > lib/bootstrap.min.css
curl https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js > lib/bootstrap.min.js
curl https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js > lib/popper.min.js
curl https://code.jquery.com/jquery-3.3.1.slim.min.js > lib/jquery-3.3.1.min.js 
curl https://cdn.jsdelivr.net/npm/chart.js@2.8.0/dist/Chart.min.js > lib/chart.min.js