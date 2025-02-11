### Структура проекта

```
/nori
  ├── /src
  │   ├── /models
  │   │   ├── model.js
  │   ├── /pages
  │   │   ├── page.jsx
  │   ├── /components
  │   │   ├── component.jsx
  │   ├── server.js
  │   ├── index.js
  │   ├── App.js
  │   ├── reportWebVitals.js
```

### Порядок работы:

1. **Запусти сервер MongoDB** (если у тебя локальный MongoDB):

   ```sh
   mongod
   ```

2. **Запусти сервер Express**:
   В папке с проектом:

   ```sh
   node server.js
   ```

3. **Запусти React-приложение**:
   В папке **/src**:
   ```sh
   npm start
   ```

Теперь ты можешь протестировать API с помощью **Postman** или просто взаимодействовать с фронтендом для добавления и получения викторин.
