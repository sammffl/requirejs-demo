var asObj = {
    deadline: 7 * 24 * 60 * 60 * 1000,
    "12345": [
        {question: "q0", answer: "a0", timestamp: 1468610935071},
        {question: "q1", answer: "a1", timestamp: 1468710935071},
        {question: "q2", answer: "a2", timestamp: 1469415835071},
        {question: "q3", answer: "a3", timestamp: 1469416735071},
        {question: "q4", answer: "a4", timestamp: 1469416785071},
        {question: "q5", answer: "a5", timestamp: 1469425735071}
    ],
    "54321": [
        {question: "q1", answer: "a1", timestamp: 1469415735071},
        {question: "q2", answer: "a2", timestamp: 1469416785071},
        {question: "q3", answer: "a3", timestamp: 1469425735071}
    ]
};

var messages = asObj['12345'];
var deadline = new Date().getTime() - asObj.deadline;
var arr = [];
for (var i = 0, max = messages.length; i < max; i++) {
    if (deadline > messages[i].timestamp) {
        arr.push(i);
        continue;
    }
}



// messages.splice(1,1);
// messages.splice(0,1);
//
// console.log(messages);



function len(s) {
    var l = 0;
    var a = s.split("");
    for (var i=0;i<a.length;i++) {
        if (a[i].charCodeAt(0)<299) {
            l++;
        } else {
            l+=2;
        }
    }
    return l;
}

console.log(len('sdf'))


