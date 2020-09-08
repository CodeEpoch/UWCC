var uwaterlooApi = require('uwaterloo-api');
var fs = require("fs");

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

const dir = './course_data/'
// let uw_courses = new Map()


// let user_course = ["CS115", "CS135", "GEOG101", "GEOG201", "ECON101", "AFM101"]
let user_course = ['GEOG101', 'GEOG102', 'GEOG187', 'GEOG281', 'ENVS178', 'ENVS278', 'MATH114 ', 'ENGL109', 'CS135', 'INTST101', 'PSYCH101', 'GEOG310', 'GEOG387', 'GEOG201', 'GEOG203', 'CS116', 'GEOG381', 'CS234', 'CS136', 'ECON101', 'AFM101', 'GEOG271', 'CS338', 'GEOG318', 'GEOG206', 'GEOG207', 'GEOG374', 'GEOG411', 'GEOG481']

let offset = 0
let filter = ["CS"]

function loop_preq(courses, preqs2, req_num, init) {
  for (i = init; i < preqs2.length; i++) {
    if (typeof preqs2[i] === "object") {
      let check_preq = preq_check(courses, preqs2[i], offset)
      // console.log(i, "obj in preq:", preqs2[i], check_preq)
      if (check_preq) {
        req_num -= 1
      }
      console.log("1231454 in preq:", preqs2[i])
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
function preq_check(courses1, preqs, offset) {
  function can_take(courses, preq, req_num) {
    if (!!preq) {
      if (typeof preq[0] === "number") {
        // console.log(preq[0] )
        if (preq[0] < offset) { return true }
        if (req_num == -1) { req_num = preq[0] - offset }
        else { req_num += preq[0] }
        return loop_preq(courses, preq, req_num, 1)
      }

      else if (typeof preq[0] == "string") {
        req_num = preq.length - offset
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
  }
  return can_take(courses1, preqs, -1)
}
// function preq_check(courses1, preqs, offset) {
//   function can_take(courses, preq, req_num) {
//     if (preq.length == 0 && req_num != 0) {
//       return false
//     }
//     else if (preq.length == 0 && req_num == 0) {
//       return true
//     }
//     else if (typeof preq[0] === "number") {
//       if (preq[0] < offset) { return true }
//       if (req_num == -1) { req_num = preq[0] - offset }
//       return can_take(courses, preq.slice(1), req_num)
//     }
//     else if (typeof preq[0] == "string") {
//       if (courses.includes(preq[0])) {
//         // if (preq.length == 1 && req_num < 0) { return true } // note: might have chance that only CS555 past in ["CS555, CS666"] but still return true
//         req_num -= 1
//         if (req_num == 0) { return true }
//       }
//       return can_take(courses, preq.slice(1), req_num)
//     }

//     else if (typeof preq[0] === "object") {
//       if (typeof preq.slice(1)[0] === "object")
//         return can_take(courses, preq[0], -1) && can_take(courses, preq.slice(1), req_num)
//       else if (typeof preq.slice(1)[0] === "string") {
//         if (can_take(courses, preq[0], -1)) { req_num -= 1 }
//         return can_take(courses, preq.slice(1), req_num)
//       } else {
//         return can_take(courses, preq[0], -1)
//       }
//     }
//     else { console.log(preq, req_num) }
//   }
//   return can_take(courses1, preqs, -1)
// }

function main() {
  const course_list = new HashTable()
  let filter_term = "F" // "F" "W","S"
  let filter_subject = "GEOG"
  let program_restriction = ["students only", "Engineer", "Psychology", "Math", "Science", "Chemistry", "Physics",]
  // let program_restriction = ["students only"]

  fs.readdirSync(dir).forEach(file => {
    const sub_course = JSON.parse(fs.readFileSync(`${dir}${file}`, { encoding: 'utf8', flag: 'r' }))
    if (sub_course.length != 0) {
      sub_course.forEach(course => {
        course_id = Object.keys(course)
        course_info = Object.values(course)[0]
        preq = course_info.preq

        // && 
        // if (typeof course_info.terms_offered !== 'undefined' && course_info.terms_offered.includes(filter_term)) {

        if (course_id[0].includes(filter_subject)) {
          if (typeof preq == "object" && preq_check(user_course, preq, offset)) {
            let no_cheack = true
            program_restriction.forEach(nos => {
              if (course_info.preq_note.includes(nos)) { no_cheack = false }
            });

            if (no_cheack && !user_course.includes(course_id[0])) { course_list.setItem(course_id, course_info) }
          }
        }
      });
    }
  })

  let display_num = 0
  if (filter.length > 1) {
    filter.forEach(option => {
      course_list.keys().forEach(key => {
        if (key.includes(option)) {
          console.log(course_list.getItem(key))
          display_num++
        }
      });
    });
  } else {
    console.log(course_list.items)
    display_num = course_list.length
  }

  console.log(display_num)


}

// fs.readFileSync(`${dir}ACC.txt`, 'utf8', (err, data) => {
//   d = JSON.parse(data)
//   console.log(d[0])
// })

main()
// for (var k in h) {
//   // use hasOwnProperty to filter out keys from the Object.prototype
//   if (h.hasOwnProperty(k)) {
//       alert('key is: ' + k + ', value is: ' + h[k]);
//   }
// }
