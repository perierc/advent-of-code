typescript-today:
	cd $(shell date +%Y) && cd day$(shell date +%d) && ts-node *.ts

typescript:
	cd $(year) && cd day$(day) && ts-node *.ts
