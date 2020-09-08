var fs = require("fs");
var uwaterlooApi = require('uwaterloo-api');


var uw_api = new uwaterlooApi({
    API_KEY: '7a46eb006fffa5b826764c730e17b95c'
});

let subject = "hi"
let catalog_number = "123"
const dir = './course_data/'

function write_test() {
    let data = `{${subject} ${catalog_number}, }`

    // fs.appendFile(`${dir}${subject}.txt`, data, function (err) {
    //     if (err) {
    //         return console.error(err);
    //     }

    //     // Read the newly written file and print all of its content on the console
    //     //  fs.readFile('input.txt', function (err, data) {
    //     //     if (err) {
    //     //        return console.error(err);
    //     //     }
    //     //     console.log("Asynchronous read: " + data.toString());
    //     //  });
    // })

    fs.writeFile('./course_data/ACC.txt', '[', (err) => {
        //     if (err) {
        //         return console.error(err);
        //     }
    })
}


function foreach_test() {
    let l = []

    for (i = 1; i < 4; i++) {
        l.push({ [i]: i * i })
    }

    l.forEach(e => {
        console.log(e)
    });
}

function HashTable() {
    this.length = 0;
    this.items = {};
    // for (var p in obj) {
    //     if (obj.hasOwnProperty(p)) {
    //         this.items[p] = obj[p];
    //         this.length++;
    //     }
    // }

    this.setItem = function (key, value) {
        var previous = undefined;
        if (this.hasItem(key)) {
            previous = this.items[key];
        }
        else {
            this.length++;
        }
        this.items[key] = value;
        return previous;
    }

    this.getItem = function (key) {
        return this.hasItem(key) ? this.items[key] : undefined;
    }

    this.hasItem = function (key) {
        return this.items.hasOwnProperty(key);
    }

    this.removeItem = function (key) {
        if (this.hasItem(key)) {
            previous = this.items[key];
            this.length--;
            delete this.items[key];
            return previous;
        }
        else {
            return undefined;
        }
    }

    this.keys = function () {
        var keys = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                keys.push(k);
            }
        }
        return keys;
    }

    this.values = function () {
        var values = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    }

    this.each = function (fn) {
        for (var k in this.items) {
            if (this.hasItem(k)) {
                fn(k, this.items[k]);
            }
        }
    }

    this.clear = function () {
        this.items = {}
        this.length = 0;
    }
}

function api_test() {
    // uw_api.get('/courses/GEOG', function (err, res) {
    //     res.data.forEach(element => { 
    //         if (element.catalog_number == "371") {
    //             console.log(element)
    //         }

    //     })
    // })
    uw_api.get(`/courses/012607`, function (err, res2) {
        console.log(res2.data)
    })
}


function preq_check(courses1, preqs, offset) {
    function loop_preq(courses, preqs2, req_num, init) {
        for (i = init; i < preqs2.length; i++) {
            if (typeof preqs2[i] === "object") {

                let check_preq = can_take(courses, preqs2[i], -1)
                console.log("obj in preq:", preqs2[i], check_preq)
                if (check_preq) {
                    req_num -= 1
                }
            }
            else if (courses.includes(preqs2[i])) {
                req_num -= 1
            }
            if (req_num == 0) {
                return true
            }
        }
        return false
    }
    function can_take(courses, preq, req_num) {
        if (typeof preq[0] === "number") {
            // console.log(preq[0] )
            if (preq[0] < offset) { return true }
            if (req_num == -1) { req_num = preq[0] - offset }
            else { req_num += preq[0] }
            console.log(preq)
            return loop_preq(courses, preq, req_num, 1)
        }

        else if (typeof preq[0] == "string") {
            req_num = preq.length - offset
            console.log(preq)
            return loop_preq(courses, preq, req_num, 0)
        }

        else if (typeof preq[0] === "object") {
            let preq2 = preq.slice(1)[0]
            if (typeof preq2 != "undefined") { return can_take(courses, preq[0], req_num) && can_take(courses, preq2, req_num) }
            else {
                return can_take(courses, preq[0], req_num)
            }
        }

        else { console.log(typeof preq[0], preq, req_num) }
        return false
    }
    return can_take(courses1, preqs, -1)
}

// //preq_check
// let offset = 0
// let courses1 = ["PHYS241", "GEOG271", "PHYS234",]
// let preqs1 =["GEOG271"]
// let courses2 = ["PHYS112", "PHYS234", "PHYS258",]
// let preqs2 = [ 1,
//     [ 'PHYS364', 'PHYS365' ],
//     [ 'AMATH332', 'AMATH351', 'AMATH353' ] ]
// // console.log( preqs2.slice(1)[0])
// console.log(preq_check(courses1, preqs1, offset))

// api_test()

// const h = new HashTable()
// h.setItem("csa", "course_info")
// h.setItem("a1", "aaaaaaaaaaaa")
// h.setItem("a2", "b")
// h.setItem("a3", "cccc")

console.log(!!null)
