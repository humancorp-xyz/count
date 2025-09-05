import { y as attr_class, x as escape_html, z as attr, v as pop, t as push, F as ensure_array_like } from "../../chunks/index.js";
import "@tauri-apps/plugin-sql";
function Counter($$payload, $$props) {
  push();
  let { counter } = $$props;
  counter.name;
  let isLoading = false;
  $$payload.out.push(`<div${attr_class("counter svelte-1q155vh", void 0, { "loading": isLoading })}><div class="counter-header svelte-1q155vh">`);
  {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<button class="counter-name svelte-1q155vh" title="Click to edit name">${escape_html(counter.name)}</button>`);
  }
  $$payload.out.push(`<!--]--> `);
  {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<button class="delete-button svelte-1q155vh"${attr("disabled", isLoading, true)} title="Delete counter">×</button>`);
  }
  $$payload.out.push(`<!--]--></div> <div class="counter-value svelte-1q155vh">${escape_html(counter.value.toLocaleString())}</div> <div class="counter-controls svelte-1q155vh"><button class="counter-button decrement svelte-1q155vh"${attr("disabled", isLoading, true)} title="Decrease by 1">−</button> <button class="counter-button increment svelte-1q155vh"${attr("disabled", isLoading, true)} title="Increase by 1">+</button></div> <div class="counter-meta svelte-1q155vh">Updated ${escape_html(new Date(counter.updated_at).toLocaleDateString())}</div></div>`);
  pop();
}
function CounterList($$payload, $$props) {
  push();
  let counters = [];
  let showNewForm = false;
  $$payload.out.push(`<div class="counter-list svelte-b7qnja"><header class="header svelte-b7qnja" data-tauri-drag-region=""><h1 class="app-title svelte-b7qnja" data-tauri-drag-region="">count</h1> <button class="add-button svelte-b7qnja"${attr(
    "disabled",
    // Load counters on mount
    // Add global keyboard shortcut listener
    showNewForm,
    true
  )} data-tauri-drag-region="false">+ new</button></header> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  {
    $$payload.out.push("<!--[!-->");
    if (counters.length === 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="empty-state svelte-b7qnja"><p class="empty-message svelte-b7qnja">No counters yet</p> <p class="empty-hint svelte-b7qnja">Click "New Counter" to create your first one</p></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      const each_array = ensure_array_like(counters);
      $$payload.out.push(`<div class="counters-grid svelte-b7qnja"><!--[-->`);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let counter = each_array[$$index];
        Counter($$payload, {
          counter
        });
      }
      $$payload.out.push(`<!--]--></div>`);
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]--></div>`);
  pop();
}
function _page($$payload) {
  CounterList($$payload);
}
export {
  _page as default
};
