var uwaterlooApi = require('uwaterloo-api');
var fs = require("fs");

// Course obj
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

function loop_preq(courses, preqs2, req_num, init) {
  for (i = init; i < preqs2.length; i++) {
    if (typeof preqs2[i] === "object") {
      let check_preq = preq_check(courses, preqs2[i], offset)
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

function preq_check(courses1, preqs, offset) {
  function can_take(courses, preq, req_num) {
    if (!!preq) {
      if (typeof preq[0] === "number") {
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



function main(user_course, offset, filter,filter_subject, program_restriction) {
  const course_list = new HashTable()
  // let program_restriction = ["students only"]

  fs.readdirSync(dir).forEach(file => {
    const sub_course = JSON.parse(fs.readFileSync(`${dir}${file}`, { encoding: 'utf8', flag: 'r' }))
    if (sub_course.length != 0) {
      sub_course.forEach(course => {
        course_id = Object.keys(course)
        course_info = Object.values(course)[0]
        preq = course_info.preq

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
  let display_list = []
  if (filter.length > 0) {
    filter.forEach(option => {
      course_list.keys().forEach(key => {
        if (key.includes(option)) {
          console.log(key, course_list.getItem(key))
          display_num++
          display_list.push(key)
        }
      });
    });
  } else {
    course_list.keys().forEach(key => {
      console.log(key, course_list.getItem(key))
      display_num++
      display_list.push(key)
    
    });
  }

  console.log("# of course you can take: ", display_num)
  console.log(display_list)
  
}


let user_course = ['GEOG101', 'GEOG102', 'GEOG187', 'GEOG281', 'ENVS178', 'ENVS278', 'MATH114 ', 'ENGL109', 'CS135', 'INTST101', 'PSYCH101', 'GEOG310', 'GEOG387', 'GEOG201', 'GEOG203', 'CS116', 'GEOG381', 'CS234', 'CS136', 'ECON101', 'AFM101', 'GEOG271', 'CS338', 'GEOG318', 'GEOG206', 'GEOG207', 'GEOG374', 'GEOG411', 'GEOG481']
let offset = 0
let filter = [] //subject filter e.g. "CS", "GEOG"
let filter_term = "F" // "F", "W","S"
let filter_subject = "GEOG"
let program_restriction = ["students only", "Engineer", "Psychology", "Math", "Science", "Chemistry", "Physics",] // program to exclude

main(user_course, offset, filter, filter_subject, program_restriction)

