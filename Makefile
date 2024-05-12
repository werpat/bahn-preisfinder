.PHONY: start
start: build
	docker compose up --force-recreate --remove-orphans --detach

.PHONY: build
build:
	docker compose build

.PHONY: stop
stop:
	docker compose down --remove-orphans --volumes || true

.PHONE: clean
clean: stop
	docker image rm werpat/bahn-preisfinder || true