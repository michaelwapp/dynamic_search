
# Dynamic Search Implementation using Turbo Frames

This Rails 7.1 project showcases how to implement dynamic search (searching in you local data as well as from an external data source) functionality using Turbo Frames. The project is built using Ruby 3.2.2 and leverages the power of Hotwire's TurboFrames to update parts of the webpage without a full page reload.

## Prerequisites

Before you begin, ensure you have the following installed:
- Ruby 3.2.2
- Rails 7.1
- Node.js and Yarn (for JavaScript dependencies)
- Bootstrap 5.3.x

## Getting Started

To get started with the project, clone the repository and install the necessary dependencies:

```bash
bundle install
yarn install
```

## Running the Application

To run the application locally:

```bash
bin/dev
```

Navigate to `http://localhost:3000` in your web browser to view the application.

## Dynamic Search Form with TurboFrames

The application demonstrates how to use TurboFrames to dynamically load and display search results from a search form. Here's an overview of the implementation:

### 1. Setup TurboFrames

Ensure that Turbo is included in your application. You can verify this in your `Gemfile` and `app/javascript/application.js`.

### 2. Create a search form

Create a search form in any view (e.g., `app/views/index.html.erb`) and ensure the form submits against the same action.

```html 
<%= form_with url: projects_path, method: :get, data: { controller: "formsubmission", turbo_frame: 'project_listings' } do |form| %>
    <%= form.search_field :q, class: 'form-control', placeholder: "Search for Name or Description", data: { action: "input->formsubmission#search" } %>
<% end %>
```

### 3. Use TurboFrame to Display the search results

Use a TurboFrame tag to define the area where the search results will be displayed. Use another TurboFrame tag to display the external search results. This turbo frame is lazy loaded meaning that as soon as it is displayed it triggers it's defined action. This allows us to trigger the external search query in a different controller action. The search value and a way to only trigger the external search is passed s.t. we can avoid searching in the external search for empty search values or in case the local search already has some results. 

```erb
<%= turbo_frame_tag 'project_listings' do %>
    <% unless @results.empty? %>
        <% @results&.each do |project| %>
            <div class="p-2 border">
                <div class="fs-6">Name: <%= project.name %> - Description: <%= project.description %></div>
            </div>
        <% end %>
    <% end %>
    <%= turbo_frame_tag 'external_search_result', src: load_external_search_project_path(q: @search, avoid_search: @results.any?), loading: :lazy do %>
    <% end %>
<% end %>
```

As the `external_search_result` TurboFrame is added within the main search result TurboFrame `proejct_listings` it's always updated on every search result and therefore automatically triggers an external search in case no local search results are available.

### 4. Add External Search Action

The external search action added to our controller looks like the following code block. It demonstrates how an external search could look like. 

```ruby
  def external_search_project
    return if params[:q].blank? || params[:avoid_search] == "true"

    sleep 1.0 # simulate external request
    @external_search_result = [Project.new(name: "External Project", description: "Loaded from wherever")]
  end
```

This action returns a view template with the same `external_search_result` TurboFrame s.t. it will only update the external search results in the view. 

```html 
<%= turbo_frame_tag "external_search_result" do %>
  <% @external_search_result&.each do |project| %>
    <div class="p-2 border">
      <div class="fs-6">Name: <%= project.name %> - Description: <%= project.description %></div>
    </div>
  <% end %>
<% end %>

```

Now, in case no local search results are provided, the external search is triggered and the results are shown in the corresponding TurboFrame.

### 5. Optional: Automatic Form Submission

In order to have the search form submit automattically, I've added a simple Stimulus controller which auto submits the form after 300ms. The implementation looks like this: 

```javascript
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
```

## Further Information

For more information on TurboFrames, refer to the following resources:
- [Hotwire Turbo](https://turbo.hotwired.dev/)

### Contact

For more details, contact [me](michaelwapp.com)

Copyright Michael Bauer-Wapp 2024
