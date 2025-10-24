#==================== PARAM =====================#

UP_TRACKER		:=	.up_done
COMPOSE_BAKE	=	true

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

all		: up

$(UP_TRACKER)	: docker-compose.yml
		sed -i '/^IP=/d' .env
		echo "IP=$$(hostname -I | awk '{print $$1}')" >> .env
		docker compose -f docker-compose.yml up -d
		echo "You can acces the website trougth:\n https://$$(hostname -I | awk '{print $$1}')"
		touch $(UP_TRACKER)

up		: $(UP_TRACKER)

dev		:
		sed -i '/^IP=/d' .env
		echo "IP=$$(hostname -I | awk '{print $$1}')" >> .env
		docker compose -f docker-compose.yml up

down	:
		printf "\n $(GREEN)Containers down$(RESET) \n"
		docker compose -f docker-compose.yml down -v
		sed -i '/^IP=/d' .env
		rm -f $(UP_TRACKER)

clean	: down

fclean	: clean
		printf "\n $(GREEN)Delete containers images$(RESET) \n"
		docker system prune -af --volumes

retry	: down dev
re		: fclean all

.PHONY	=	all up down clean fclean re dev retry

ifndef VERBOSE
.SILENT:
endif
