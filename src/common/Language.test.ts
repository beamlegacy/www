import Language from "./Language"

describe("Language", () => {

  test("should find and update translation for French language", () => {
    class en extends Language {
      translation = [
        {
          greeting: "Hello"
        }
      ]
    }

    class fr extends en {
      constructor() {
        super()

        this.translateFromArray(this.translation, "greeting", {
          "Hello": "Bonjour"
        })
      }
    }

    const langEn = new en()
    const langFr = new fr()

    expect(langEn.translation[0]).toEqual({greeting: "Hello"})
    expect(langFr.translation[0]).toEqual({greeting: "Bonjour"})
  })
})
