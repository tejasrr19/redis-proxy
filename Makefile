PROJECT = "RedisProxy"

test: ;@echo "Testing ${PROJECT}....."; \
		npm run pretest; \
		npm run test; \
		npm run stop-services; \

.PHONY: test
