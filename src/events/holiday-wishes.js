var msgs = 0
function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

module.exports = function(client, message, sql){
    if (message.author.bot) return
    if (message.channel.id == '791408464613998652'){
        sql.query('INSERT INTO `holiday-wishes` (`msg`) VALUES (?)', message.content, function(err, res){
            if (err){
                console.error(err)
            }
        })
    } else {
        msgs++
        if (msgs == 100){
            msgs = 0
            sql.query('SELECT `msg` FROM `holiday-wishes`', function(err, res){
                if (err){
                    console.error(err)
                } else {
                    if (res.length < 1) return
                    var msglist = []
                    res.foreach(r=>{
                        msglist.push(r.msg)
                    })
                    message.channel.send(randomItem(msglist))
                }
            })
        }
    }
}
