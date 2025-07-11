---
applyTo: "src/dbs/**.json"
---

- El formato del archivo debe ser JSON.
- El archivo debe contener un esquema JSON válido que siga la estructura definida en `schema.json` (`"$schema": "./schema.json"`).
- El archivo debe contener un objeto con una propiedad `questions` que sea un array.
- El objeto raíz debe tener exactamente las siguientes propiedades:
  - `"$schema": "./schema.json"`
  - `language`: string. Idioma del contenido, debe ser "en" (inglés).
  - `questions`: un array de preguntas (puede estar vacío).
- Todo el contenido (preguntas, respuestas y ejemplos) debe estar en inglés.
- Cada elemento del array `questions` debe ser un objeto con las siguientes propiedades obligatorias:
  - `question`: string. La pregunta.
  - `anwer`: string. La respuesta.
- Cada elemento puede tener opcionalmente las propiedades:
  - `example`: string. Un ejemplo de uso.
  - `choices`: array de strings. Opciones de respuesta para la pregunta.
- Ejemplo de formato válido:

```json
{
  "$schema": "./schema.json",
  "language": "en",
  "questions": [
    {
      "question": "What is the past continuous tense?",
      "anwer": "It describes actions that were ongoing in the past.",
      "example": "I was eating dinner when you called.",
      "choices": [
        "It describes actions that were ongoing in the past.",
        "It describes future actions.",
        "It describes completed actions."
      ]
    }
  ]
}
```
