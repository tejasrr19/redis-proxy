PROJECT = "RedisProxy"

test: ;@echo "Testing ${PROJECT}....."; \
		npm run pretest; \
		npm run test; \

.PHONY: test
