//暴露项目所有情况下的端口

module.exports={
    local:{
        open:true,
        port:3000
    },
    http:{
        open:false,
        port:80
    },
    https:{
        open:false,
        port:443
    },
    // https:{
    //     open:false,
    //     port:443
    // }
}