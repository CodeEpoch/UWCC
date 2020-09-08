var ProgressBar = require('./ProgressBar');
var uwaterlooApi = require('uwaterloo-api');
var fs = require("fs");

const dir = './course_data/'

// //mongo db
// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://admin:hXEoTaMdPC4yzQeP@uwcc-cluster.y65m5.azure.mongodb.net/uw_courses?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const dbo = client.db("uw_courses").collection("uw_courses");
//   // perform actions on the collection object 

//   let myobj = { name: "Company Inc", address: "Highway 37" }; 

//   client.close();
// });

// Course obj
class Course {
    // constructor() {}
    init(subject, catalog_number, title, preq, antireq, terms_offered, units) {
        this.id = subject + ' ' + catalog_number
        this.subject = subject
        this.title = title
        this.preq = preq
        this.antireq = antireq
        this.terms_offered = terms_offered
        this.units = units
    }
}

const Bar = new ProgressBar();
var uw_api = new uwaterlooApi({
    API_KEY: '7a46eb006fffa5b826764c730e17b95c'
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function clear_course_data() {
    fs.readdirSync(dir).forEach(file => {
        fs.writeFileSync(`${dir}${file}`, '[')
    })
}

//===========================================================
async function get_data(start, interval) {
    uw_api.get('/courses', function (err, res) {
        if (typeof res == "undefined") {
            console.log(`res no data at ${start} ~ ${interval}`)
        } else {
            let courses1 = res.data
            // let last_sub = ""
            // let total = res.data.length
            let courses = []
            for (i = start; i < start + interval; i++) {
                courses.push(courses1[i])
            }

            courses.forEach(course => {
                let subject = course.subject
                let catalog_number = course.catalog_number
                let title = course.title
                let course_id = course.course_id
                let key = subject + catalog_number

                //get pre req
                const info_uri = `/courses/${course_id}`
                const uri = `/courses/${subject}/${catalog_number}/prerequisites`
                // const uri2 = `/courses/PHYS/234/prerequisites`

                if(title.includes("\"")){
                    title = title.replace("\"", "\\\"")
                }

                uw_api.get(uri, function (err, res2) {
                    let data = ""
                    if (res2 != undefined && res2.meta.status == 200) {
                        preq = JSON.stringify(res2.data.prerequisites_parsed)
                        preq_note = JSON.stringify(res2.data.prerequisites)
                        data = ` {"${key}": {"title": "${title}", "preq": ${preq}, "preq_note": ${preq_note}, `
                    } else {
                        data = ` {"${key}": {"title": "${title}", "preq": "", `
                    }

                    uw_api.get(info_uri, function (err, res3) {
                        let terms_offered = JSON.stringify(res3.data.terms_offered)
                        let antireq = JSON.stringify(res3.data.antirequisites)
                        let units = res3.data.units
                        let data_info = `"antireq": ${antireq}, "terms_offered": ${terms_offered}, "units": ${units}}},`

                        // write_course(subject, data + data_info)

                        const dir = './course_data/'
                        fs.appendFile(`${dir}${subject}.txt`, data + data_info, function (err) {
                            if (err) {
                                return console.error(err);
                            }
                        })
                    })
                    // last_sub = subject
                })
            })
        }
    })
}


async function get_data_by_subject(subj) {
    //VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
    async function process_data(courses) {

    }
    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    uw_api.get(`/courses/${subj}`, function (err, res) {
        if (typeof res == "undefined") {
            console.log(`res no data at ${subj}`)
        } else {
            courses = res.data
            courses.forEach(course => {
                let subject = course.subject
                let catalog_number = course.catalog_number
                let title = course.title
                let course_id = course.course_id
                let key = subject + catalog_number

                //get pre req
                const info_uri = `/courses/${course_id}`
                const uri = `/courses/${subject}/${catalog_number}/prerequisites`

                uw_api.get(uri, function (err, res2) {
                    let data = ""
                    if (res2 != undefined && res2.meta.status == 200) {
                        preq = JSON.stringify(res2.data.prerequisites_parsed)
                        preq_note = JSON.stringify(res2.data.prerequisites)
                        data = ` {"${key}": {"title": "${title}", "preq": ${preq}, "preq_note": ${preq_note}, `
                    } else {
                        data = ` {"${key}": {"title": "${title}", "preq": "", `
                    }

                    uw_api.get(info_uri, function (err, res3) {
                        let terms_offered = JSON.stringify(res3.data.terms_offered)
                        let antireq = JSON.stringify(res3.data.antirequisites)
                        let units = res3.data.units
                        let data_info = `"antireq": ${antireq}, "terms_offered": ${terms_offered}, "units": ${units}}},`

                        const dir = './course_data/'
                        fs.appendFileSync(`${dir}${subject}.txt`, data + data_info)
                    })
                })
            })
        }
    })
}

async function main() {
    let total = 7450
    let interval = 25
    let pause_time = 2500
    let loop = Math.floor(total / interval) * interval

    console.log("ALL DATA IS GOING TO BE CLEARED IN 5 SEC")
    for (i = 5; i > 0; i--) {
        console.log(i)
        await sleep(1000);
    }

    clear_course_data()
    Bar.init(total);
    
    for (i = 0; i < loop; i += interval) {
        await get_data(i, interval)
        await sleep(pause_time);
        Bar.update(i);
    }
    for (i = loop; i < total; i += total - loop) {
        await get_data(i, total - loop)
        await sleep(pause_time);
        Bar.update(i);
    }

    await sleep(5000);
    // close bracket
    fs.readdirSync(dir).forEach(file => {
        const sub_course = fs.readFileSync(`${dir}${file}`)
        if (sub_course.length > 1) {
            let new_write = sub_course.slice(0, -1) + "]"
            fs.writeFileSync(`${dir}${file}`, new_write)
        } else {
            fs.writeFileSync(`${dir}${file}`, "[]")
            console.log(`${file} IS EMPTY !!!`)
        }
    })
}

async function fill_empty_after_main() {
    let missing = []
    fs.readdirSync(dir).forEach(file => {
        const sub_course = fs.readFileSync(`${dir}${file}`)
        if (sub_course.length == 1) {
            missing.push(file.split(".")[0])
        }
    })

    bar_len = missing.length
    Bar.init(bar_len)

    for (i = 0; i < bar_len; i++) {
        await get_data_by_subject(missing[i])

        await sleep(3000)

        const file_name = `${dir}${missing[i]}.txt`
        const sub_course = fs.readFileSync(`${file_name}`)
        const new_write = sub_course.slice(0, -1) + "]"
        fs.writeFileSync(file_name, new_write)

        Bar.update(i);
    }
}


main()
// fill_empty_after_main()

// COMST.txt IS EMPTY !!!
// EFAS.txt IS EMPTY !!!
// EVSY.txt IS EMPTY !!!
// GEMCC.txt IS EMPTY !!!
// GEOE.txt IS EMPTY !!!
// MATBUS.txt IS EMPTY !!!
// NANO.txt IS EMPTY !!!
// NATST.txt IS EMPTY !!!
// PDARCH.txt IS EMPTY !!!
// POLSH.txt IS EMPTY !!!
// PORT.txt IS EMPTY !!!
// SPD.txt IS EMPTY !!!
// UN.txt IS EMPTY !!!
// UNIV.txt IS EMPTY !!!
// WATER.txt IS EMPTY !!!


// // Reset empty data
// fs.readdirSync(dir).forEach(file => {
//     const sub_course = fs.readFileSync(`${dir}${file}`)
//     if (sub_course.length < 2) {
//         fs.writeFileSync(`${dir}${file}`, "[")
//         console.log(`${file} empty`)
//     }
// })

// // close bracket
// fs.readdirSync(dir).forEach(file => {
//     var sub_course = fs.readFileSync(`${dir}${file}`)
//     if (sub_course.slice(-1) == ",") {
//         let new_write = sub_course.slice(0, -1) + "]"
//         fs.writeFileSync(`${dir}${file}`, new_write)
//     } else {
//         console.log(`${sub_course.slice(-1) } `)
//     }
// })

// // check error
// fs.readdirSync(dir).forEach(file => {
//     var sub_course = JSON.stringify(fs.readFileSync(`${dir}${file}`))
//     if (sub_course.split("}}").length > 2) {
//         // let new_write = sub_course.slice(0, -1) + "]"
//         // fs.writeFileSync(`${dir}${file}`, new_write)
//         console.log(`${file} error`)
//     } else {
//         // console.log(`${dir}${file}`)
//     }
// })
