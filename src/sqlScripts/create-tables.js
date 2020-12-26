module.exports = async function(sql, client, config){

    await sql.query("CREATE TABLE `twitter_status` (`isOnline` TINYINT(1) PRIMARY KEY DEFAULT 0)" , (err, res) => {
        if (err) console.error(err)
        console.log('[SQL] Created table `twitter_status`')
        sql.query('INSERT INTO `twitter_status` (`isOnline`) VALUES (0)', (err,res)=>{
            if (err) console.error(err)
            console.log('[SQL] `isOnline` has been insered to `twitter_status`, value: 0')
        })
    })

    await sql.query("CREATE TABLE `events` (`id` INT NOT NULL AUTO_INCREMENT, `name` VARCHAR(64) NOT NULL, `date_start` DATE NOT NULL, `date_end` DATE NULL, `description` LONGTEXT NULL, PRIMARY KEY (`id`));", (err, res) => {
        if (err) console.error(err)
        console.log('[SQL] Created table `events`')
    })

    await sql.query("CREATE TABLE `mention_responses` (`id` BIGINT(255) NOT NULL AUTO_INCREMENT, `user` VARCHAR(64) NOT NULL, `message` VARCHAR(1000) NOT NULL, PRIMARY KEY (`id`));", (err, res) => {
        if (err) console.error(err)
        console.log('[SQL] Created table `mention_responses`')
    })

    await sql.query("CREATE TABLE `giveaways` (`id` INT(1) NOT NULL AUTO_INCREMENT, `message_id` VARCHAR(64) NOT NULL, `data` JSON NOT NULL, PRIMARY KEY (`id`));", (err, res) => {
        if (err) console.error(err)
        console.log('[SQL] Created table `giveaways`')
    })
}
