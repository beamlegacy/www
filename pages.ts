class Page<M> {
  constructor(public messages: Record<string, M>, public srcPath: string) {
  }
}

interface HomeMessages {
  metas: {
    title: string,
    description: string
  }
  title: string
}

class HomeMessages_en implements HomeMessages {
  metas = {
    title: "Welcome to beam",
    description: "",
  }

  title = "Welcome to beam"
}

class HomeMessages_fr implements HomeMessages {
  metas = {
    title: "Bienvenue sur beam",
    description: "",
  }

  title = "Bienvenue sur beam"
}

class HomePage extends Page<HomeMessages> {
  constructor() {
    super(
      {
        en: new HomeMessages_en(),
        fr: new HomeMessages_fr()
      },
      "index.html"
    )
  }
}

const pages: Page<any>[] = [
  new HomePage()
]
const exported: Record<string, any>[] = []
pages.forEach(page => {
  const {messages, srcPath, ...rest} = page
  exported.push({messages: messages.en, srcPath, ...rest})
  exported.push({messages: messages.fr || messages.en, srcPath, ...rest, filename: `fr/${srcPath}`})
})
console.log(exported)

module.exports = {pages: exported}