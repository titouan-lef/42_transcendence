#==================== COLOR =====================#

RESET			:=	\e[0m
BLACK			:=	\e[30m
RED				:=	\e[31m
GREEN			:=	\e[32m
YELLOW			:=	\e[33m
BLUE			:=	\e[34m
MAGENTA			:=	\e[35m
CYAN			:=	\e[36m

#===================== RULE =====================#

all: prod

env:
		touch .frontend_env .backend_env
		echo "Checking required variables in .backend_env..."
		grep -q "EMAIL=" .backend_env || (echo "❌ Missing EMAIL in .backend_env" && exit 1)
		grep -q "EMAIL_PASSWORD=" .backend_env || (echo "❌ Missing EMAIL_PASSWORD in .backend_env" && exit 1)
		grep -q "JWT_SECRET=" .backend_env || (echo "❌ Missing JWT_SECRET in .backend_env" && exit 1)
		grep -q "CONTRACT_ADDRESS=" .backend_env || (echo "❌ Missing CONTRACT_ADDRESS in .backend_env" && exit 1)
		grep -q "PRIVATE_KEY=" .backend_env || (echo "❌ Missing PRIVATE_KEY in .backend_env" && exit 1)
		grep -q "RPC_URL=" .backend_env || (echo "❌ Missing RPC_URL in .backend_env" && exit 1)
		# @todo Add everything necessary
		echo "✅Env files are valid"

prod: env
		@if grep -q "MODE=dev" .backend_env 2>/dev/null; then \
			echo "⚠️ Switching from DEV → PROD, removing images"; \
			make clean; \
		fi
		sed -i '/^MODE=/d' .backend_env
		echo "MODE=prod" >> .backend_env
		mkdir -p ./backups/pictures
		docker compose -f docker-compose.yml up -d
		echo "You can access the website through:\n https://$$(hostname -I | awk '{print $$1}'):8888"

dev: env
		@if grep -q "MODE=prod" .backend_env 2>/dev/null; then \
			echo "⚠️ Switching from PROD → DEV, removing images"; \
			make clean; \
		fi
		sed -i '/^MODE=/d' .backend_env
		echo "MODE=dev" >> .backend_env
		docker compose -f docker-compose.dev.yml up

down: env
		docker compose -f docker-compose.yml down -v
		printf "\n$(GREEN)Containers down$(RESET) \n"
		printf "\n$(GREEN)Env files cleared$(RESET) \n"

clean: down
		printf "\n$(RED)Deleting containers images$(RESET) \n"
		sed -i '/^MODE=/d' .backend_env
		docker system prune -af --volumes
		printf "\n$(GREEN)System cleaned$(RESET) \n"

fclean: clean
		rm -rf ./backups

re: clean all

.PHONY:	all prod dev down clean fclean re env 

ifndef VERBOSE
.SILENT:
endif
