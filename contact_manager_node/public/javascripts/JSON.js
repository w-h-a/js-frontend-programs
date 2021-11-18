function json (form) {
    return { full_name: form[0].value
           , email: form[1].value
           , phone_number: form[2].value
           , tags: !form[3].value ? null : form[3].value.split (',').map (tag => tag.trim ().replace (/#|%|~/g, "")).join (',')
           };
}
