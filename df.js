function Series(data) {
    console.assert(Array.isArray(data), "expected array, got %s", typeof(data))
    this.data = data
}

Series.prototype.show = function() { console.table(this.data) }
Series.prototype.eq = function(val)  { return new Series(this.data.map(e => e == val)) }
Series.prototype.map = function(f) { return new Series(this.data.map(f)) }

function Dataframe(data) {
    console.assert(Array.isArray(data), "expected array, got %s", typeof(data))
    console.assert(data.length > 0, "expected nonempty array")
    this.data = data
    let first = data[0]
    this.columns = Object.keys(first)
    this.columns.forEach(col => 
        this.__defineGetter__(
            col, 
            function() { 
                return new Series(this.data.map(d => d[col]))
            }
        )
    ) 
}

function dataframeFromSource(selector, mapper) {
    let el = document.querySelector(selector)
    let content = el.innerHTML
    let mapped = mapper(content)
    return new Dataframe(JSON.parse(mapped))
}

Dataframe.prototype.show = function() { console.table(this.data, this.columns) }
Dataframe.prototype.head = function(n) { return new Dataframe(this.data.slice(0, n)) }

Dataframe.prototype.__defineGetter__ = function(name, func) {
    this.columns.push(name)
    return Object.prototype.__defineGetter__(name, func)
}

const zip = (arr0, arr1) => arr0.map((e, i) => [e, arr1[i]])

Dataframe.prototype.filter = function(series) {
    return new Dataframe(
        zip(this.data, series.data)
        .filter(ep => ep[1])
        .map(ep => ep[0])
    )
}
