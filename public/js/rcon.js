const element = document.getElementById('editor_holder');

JSONEditor.defaults.editors.array.options.disable_array_delete_last_row = true;
JSONEditor.defaults.editors.array.options.disable_array_reorder = true;

const editor = new JSONEditor(element, {
    disable_edit_json: true,
    disable_properties: true,
    remove_button_labels: true,
    iconlib: "spectre",
    theme: 'spectre',
    schema: {
        "type": "array",
        "title": "RCON НАХУЙ",
        "items": {
            "type": "object",
            "title": "Привилегия",
            "headerTemplate": "{{ self.slug }}",
            "properties": {
                "slug": {
                    "type": "string",
                },
                "commands": {
                    "title": "Команды",
                    "type": "object",
                    "format": "categories",
                    "properties": {
                        "month_1": {
                            "title": "1 месяц",
                            "type": "array",
                        },
                        "month_2": {
                            "title": "2 месяца",
                            "type": "array",
                        },
                        "month_3": {
                            "title": "3 месяца",
                            "type": "array",
                        },
                        "forever": {
                            "title": "Навсегда",
                            "type": "array",
                        },
                    }
                },
            },
            "format": "grid"
        },
    }
});

editor.on('ready',() => {
    fetch("/rcon.json").then(rs => rs.json()).then(rs => {
        editor.setValue(rs)
    })
});

const btn = document.querySelector('#save')
btn.addEventListener('click', () => {
    const value = editor.getValue();

    fetch("/admin/rcon/save", {
        method: 'post',
        body: JSON.stringify(value),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(() => {
        btn.innerText = 'Загрузка'
        btn.setAttribute('disabled', true)

        setTimeout(() => {
            btn.removeAttribute('disabled')
            btn.innerText = 'Сохранить'
        }, 2000)
    })
})