# Makefile inspired from https://stackoverflow.com/a/47534399

LIBDIR := lib
DEPS := $(LIBDIR)/bootstrap.min.css $(LIBDIR)/bootstrap.min.js $(LIBDIR)/jquery-3.3.1.min.js $(LIBDIR)/chart.min.js $(LIBDIR)/popper.min.js
URLS := https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js https://code.jquery.com/jquery-3.4.0.min.js https://cdn.jsdelivr.net/npm/chart.js@2.8.0/dist/Chart.min.js https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js

main: outDir | $(DEPS)
	@echo 'fetched all dependencies'

clean:
	@rm -rf $(LIBDIR)

outDir:
	@mkdir -p $(LIBDIR)

define DOWNLOAD_rule
$(1):
	curl -Lo $(1) $(2)
endef
$(foreach f,$(DEPS),\
	$(eval $(call DOWNLOAD_rule,$(f),$(firstword $(URLS))))\
	$(eval URLS := $(wordlist 2,$(words $(URLS)),$(URLS)))\
)
