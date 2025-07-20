# fill-audio.sh: Generar y agregar audio en base64 a preguntas

Este script permite generar automáticamente el audio en formato base64 para cada pregunta de un archivo de base de datos JSON compatible con English Machine.

## Requisitos

- Tener la variable de entorno `GTTS_CLI_PATH` configurada con la ruta al ejecutable de Google Text-to-Speech CLI.
- El archivo de preguntas debe tener la propiedad `audioSupported` en `true` y seguir el esquema del proyecto (ver `src/dbs/schema.json`).
- Tener instalado `jq` y `base64` en el sistema.

## Uso

```sh
sh scripts/fill-audio.sh src/dbs/archivo.json
```

El script recorrerá cada pregunta y generará el audio en base64, agregando el resultado en la propiedad `audioBase64` de cada pregunta dentro del archivo JSON.

> Nota: El proceso modifica el archivo original directamente.

## Ejemplo de estructura de archivo JSON

```json
{
  "$schema": "./schema.json",
  "audioSupported": true,
  "language": "en",
  "questions": [
    {
      "question": "What is the past continuous tense?",
      "answer": "It describes actions that were ongoing in the past.",
      "audioBase64": "...string base64..."
    }
  ]
}
```

## Detalles técnicos

- Por cada pregunta, el script ejecuta:
  ```sh
  $GTTS_CLI_PATH "$QUESTION" | base64 -b 0
  ```
  y agrega el resultado en la propiedad `audioBase64`.
- Si alguna validación falla (variable, argumento, existencia de archivo, soporte de audio), el script termina con error.

## Licencia

Este script es parte del proyecto English Machine bajo licencia MIT.
