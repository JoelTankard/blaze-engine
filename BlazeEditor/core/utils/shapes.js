const createArcRectangle = () => go.Shape.defineFigureGenerator("ArcRectangle", (shape, w, h) => {
    // this figure takes one parameter, the size of the corner
    let p1 = 30;  // default corner size
    let p2 = 0;
    if (shape !== null) {
        const param2 = shape.parameter2;
        p1 = shape.parameter1 ? 40 : 40;  // can't be negative or NaN
        if (!isNaN(param2)) p2 = param2;  // can't be negative or NaN
    }
    p1 = Math.min(p1, w / 2);
    p1 = Math.min(p1, h / 2); 
        // limit by whole height or by half height?
    const geo = new go.Geometry();
    // a single figure consisting of straight lines and quarter-circle arcs
    geo.add(new go.PathFigure(0, p1 + p2)
                .add(new go.PathSegment(go.PathSegment.QuadraticBezier, p1, p2, 0, p2))
                .add(new go.PathSegment(go.PathSegment.Line, w - p1, p2))
                .add(new go.PathSegment(go.PathSegment.QuadraticBezier, w, p1 + p2, w, p2))
                .add(new go.PathSegment(go.PathSegment.Line, w, (h + p2) - p1))
                .add(new go.PathSegment(go.PathSegment.QuadraticBezier, w - p1, h + p2, w, h + p2))
                .add(new go.PathSegment(go.PathSegment.Line, p1, h + p2))
                .add(new go.PathSegment(go.PathSegment.QuadraticBezier, 0, (h + p2) - p1, 0, h + p2).close()));

    return geo;
});

const createPillRectangle = () => go.Shape.defineFigureGenerator("PillRectangle", (shape, w, h) => {
    // this figure takes one parameter, the size of the corner
    let p1 = h/2;  // default corner size
    let p2 = 0;
    if (shape !== null) {
        const param1 = shape.parameter1;
        const param2 = shape.parameter2;
        if (param1) p1 = param1 ? (h/2) - 2 : h/2;
        if (!isNaN(param2)) p2 = param2;  // can't be negative or NaN
        }
        // limit by whole height or by half height?
    const geo = new go.Geometry();
    // a single figure consisting of straight lines and quarter-circle arcs
    geo.add(new go.PathFigure(p1, p2)
        .add(new go.PathSegment(go.PathSegment.Line, w - p1, p2))
        .add(new go.PathSegment(go.PathSegment.Bezier, w - p1, p2 + h, w + (p1/2), p2, w + (p1/2), p2 + h))
        .add(new go.PathSegment(go.PathSegment.Line, p1, p2 + h))
        .add(new go.PathSegment(go.PathSegment.Bezier, p1, p2, -(p1/2), p2 + h, -(p1/2), p2).close()));

    return geo;
});

export {
    createArcRectangle,
    createPillRectangle
}