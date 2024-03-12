$('#go').click(function(e){
    e.preventDefault()    
    
    frames = ".*(" + $('#frames').val() + ").*"
    //frames = frames.replace(/\.\*\.\*/g, ".*")
    //frames = frames.replace(/\.\*\.\*/g, ".*")
    frames = frames.replace(/\.\*\(\.\*\)\.\*/g, ".*")

    args = ".*(" + $('#args').val() + ").*"
    //args = args.replace(/\.\*\.\*/g, ".*")
    //args = args.replace(/\.\*\.\*/g, ".*")
    args = args.replace(/\.\*\(\.\*\)\.\*/g, ".*")
    args_neg = $('#args_neg').prop('checked')

    roles = ".*(" + $('#roles').val() + ").*"
    //roles = roles.replace(/\.\*\.\*/g, ".*")
    //roles = roles.replace(/\.\*\.\*/g, ".*")
    roles = roles.replace(/\.\*\(\.\*\)\.\*/g, ".*")
    roles_neg = $('#roles_neg').prop('checked')

    query = "frame:" + frames + "<sep>"
    query = query + "args:" + (args_neg ? ".*" : args) + "<sep>"
    query = query + "desc:.*<sep>"
    query = query + "roles:" + (roles_neg ? ".*" : roles) + "<sep>"

    console.log(query)

    results = []
    for (var frame in data) {
        if (RegExp(query).test(data[frame].string)) {
            ok = true
            if (args_neg) {
                args_query = "frame:.*<sep>args:" + args + "<sep>desc:.*<sep>roles:.*<sep>"
                console.log(args_query)
                if (RegExp(args_query).test(data[frame].string)) {
                    ok = false
                }
            }
            if (roles_neg) {
                roles_query = "frame:.*<sep>args:.*<sep>desc:.*<sep>roles:" + roles + "<sep>"
                console.log(roles_query)
                if (RegExp(roles_query).test(data[frame].string)) {
                    ok = false
                }
            }
            if (ok) {
                results.push(frame)
            }
        }
    }

    html = ""
    for (var frame of results) {
        html = html + "<a href='http://143.107.183.175:21380/verbobrasil/textoFrames/" + frame.split(".")[0] + "-v.html#:~:text=Roleset id: " + frame + "' target='_blank'>" + frame + "</a><br>" + data[frame]['desc']
        if (data[frame]["args"].length == data[frame]["roles"].length) {
            for (i in data[frame]['args']) {
                html = html + "<br><b>" + data[frame]['args'][i] + "</b>: " + data[frame]['roles'][i]
            }
        } else {
            html = html + data[frame]['args'].join(", ")
        }
        html = html + "<br><pre style='overflow:auto'>" + data[frame]['string'].replace(/<sep>/g, "&lt;sep&gt;") + "</pre>"
        html = html + ""
    }

    $('#results').html('<dt>Resultados (' + results.length + '):</dt>' + html)
    
    if (!$('#results:visible').length) {
        $('#results').slideToggle(true)
    }
})