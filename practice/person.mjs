class Person {
    constructor(name='noname',age='0'){
        this.a = name;
        this.b = age;
    }

    toJSON(){
        return {
            name: this.a,
            age: this.b,
        }
    }

    sayHello(){
        return `Hello ${this.a}`;
    }
}

console.log(Person.sayHello());
const f1 = a => a*a;
const p1 = new Person('Bill',23);
// export default f1; //只能有一個default。


export default Person;
//msj 的匯出為: export，匯出多項要各自寫出來。
