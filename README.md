# MultiSelect Transfer 2.0

jQuery plugin that converts a standard `<select multiple>` element into a dual-list transfer interface.

Originally created in 2012.

## Features

- Converts one `<select multiple>` into two connected lists
- Move items between lists using add/remove buttons
- Supports:
  - moving options between lists
  - disabling selected options instead of removing
- Optional automatic sorting
- jQuery UI support
- Keeps original `<select>` synchronized for form submission
- Lightweight and dependency-friendly

---

## Demo

Left list → available items  
Right list → selected items

```text
+----------------+      +----------------+
| Available      | ---> | Selected       |
|                | <--- |                |
+----------------+      +----------------+
```

---

## Requirements

- jQuery 1.4+
- Optional: jQuery UI

---

## Installation

Include jQuery and the plugin:

```html
<script src="jquery.js"></script>
<script src="jquery.multiselectTransfer.js"></script>
```

---

## Basic Usage

HTML:

```html
<select id="users" multiple="multiple" name="users[]">
    <option value="1">John</option>
    <option value="2">Kate</option>
    <option value="3">Mike</option>
</select>
```

JavaScript:

```javascript
$('#users').multiselectTransfer();
```

---

## Options

| Option | Default | Description |
|---|---|---|
| `transfer_way` | `'remove'` | `remove` or `disable` |
| `left_div` | `'leftdiv'` | Left container class |
| `right_div` | `'rightdiv'` | Right container class |
| `original_div` | `'original_select'` | Original select wrapper |
| `add_class` | `'transfer_add'` | Add button class |
| `remove_class` | `'transfer_remove'` | Remove button class |
| `use_ui` | `true` | Use jQuery UI styling |
| `need_sort` | `true` | Sort options automatically |
| `remove_select_after_action` | `false` | Deselect options after transfer |
| `width_prefix` | `10` | Space between select boxes |

---

## Example With Custom Options

```javascript
$('#users').multiselectTransfer({
    transfer_way: 'disable',
    use_ui: false,
    need_sort: true
});
```

---

## Events

### transferChangeEvent

Triggered after items are transferred.

```javascript
$('.rightdiv select').on('transferChangeEvent', function () {
    console.log('Selection changed');
});
```

---

## Notes

This plugin was originally written for legacy jQuery projects and older admin panels.

The code intentionally preserves compatibility with older jQuery versions and uses APIs such as `.live()`.

---

## License

MIT License

---

## Author

Maksim Bikov  
