PROJECT = "RedisProxy"

test: ;@echo "Testing ${PROJECT}....."; \
		npm run pretest; \
		@echo "Pre Test Complete....."; \
		npm run test; \
		@echo "Test Complete....."; \
		npm run stop-services; \

.PHONY: test
