
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {

  search() {
    console.log("Search Submit")
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.element.requestSubmit()
    }, 300)
  }
}