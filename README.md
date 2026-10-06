# React + TypeScript + Vite

Задание выполнялось для инстанса Telegram. В ходе выполнения выяснилось, что GREEN API для Telegram не создаeт новый чат, а может работать только с существующими чатами. На SendMessage API отдает успешный ответ и id "отправленного" сообщения: 

```JSON
{
	"idMessage": "1791296729417"
}
```
однако новый чат не создается и на GetMessage по этому id и id соответствующего чата (из CheckAccount) ответ приходит:

```JSON
{
	"statusCode": 400,
	"timestamp": "2026-10-06T14:24:30.150544189Z",
	"path": "/waInstanceМой idInstance/getMessage/Мой apiTokenInstance",
	"message": "Message not found by id 1791296729417"
}
```
Для запуска локального проекта нужно:
1. стянуть репозиторий
2. ввести в консоль **npm install** для установки зависимостей
3. ввести в консоль **npm run dev** для запуска приложения 
