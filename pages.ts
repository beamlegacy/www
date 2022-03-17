export class Page<M> {
  constructor(public messages: Record<string, M>, public srcPath: string) {
  }
}

export class LocalizedPage<M> {
  constructor(public page: Page<M>, public lang: string) {
  }

  get messages(): M {
    return this.page.messages[this.lang]
  }

  get url(): string {
    const path = this.page.srcPath
      .replace(/^index\.html$/, "")
      .replace(/\/index\.html$/, "")
    return `/${this.lang}/${path}`.replace(/\/$/, "")
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

const exported: LocalizedPage<any>[] = []
pages.forEach(page => {
  exported.push(new LocalizedPage(page, "en"))
  exported.push(new LocalizedPage(page, "fr"))
})

export {exported as pages}
