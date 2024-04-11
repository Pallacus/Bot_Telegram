# Comando TIEMPO

- Nuestro bot debe responder al comando /tiempo
    - /tiempo Madrid
    - /tiempo Chiclana
    - /tiempo New York

1. Que responda al comando
2. Que podamos recuperar la ciudad (ctx.message)
3. Mediante la API de openweather, rescatar la información del tiempo de la ciudad concreta
    - URL: https://openweathermap.org/current#name
    - API KEY: 12cc61f3282afaca14152a6185f43de0
    - ¿Qué método o librería usamos para poder hacer la petición?
4. Los datos para la respuesta:
    - Temperatura actual
    - Temperatura máxima
    - Temperatura mínima
    - Humedad