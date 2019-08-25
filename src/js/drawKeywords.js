import { s } from './state'

export default () => {

    const max = 1
    const d_min = Math.pow(s.distance * 1.5, 2)
    const d_max = Math.pow(s.distance * 2.5, 2)

    let rectangles = []

    const overlap = current => {
        let result = false
        rectangles.forEach(previous => {
            if (current[0] < previous[0] + previous[2] &&
                current[0] + current[2] > previous[0] &&
                current[1] < previous[1] + previous[3] &&
                current[1] + current[3] > previous[1]) {
                result = true
            }
        })
        return result
    }

    s.links.forEach(link => {

        const deltaX = Math.abs(link.source.x - link.target.x)
        const deltaY = Math.abs(link.source.y - link.target.y)
        const distance = Math.pow(deltaX, 2) + Math.pow(deltaY, 2)

        if (d_min < distance && distance < d_max) {

            const x = (deltaX / 2 + (link.source.x < link.target.x ? link.source.x : link.target.x))
            const y = (deltaY / 2 + (link.source.y < link.target.y ? link.source.y : link.target.y))

            const tokens = Object.entries(link.tokens)
                .filter(token => {
                    const scale = s.keywordScale(token[1])
                    return (s.zoomIdentity.k - 1 <= scale && scale <= s.zoomIdentity.k + 1)
                })
                .filter(token => {
                    const rect = [
                        x,
                        y,
                        s.context.measureText(token[0]).width,
                        s.context.measureText('M').width * 1.5
                    ]
                    const result = !overlap(rect)
                    return result
                })
                .slice(0, max)

            s.context.beginPath()
            s.context.fillStyle = s.colors.keywords
            s.context.textAlign = 'center'

            tokens.forEach(([key, value]) => {

                s.context.font = `normal 300 ${value * .05}pt Helvetica`
                s.context.fillText(key, x, y)
                
                const rect = [
                    x,
                    y,
                    s.context.measureText(key).width,
                    s.context.measureText('M').width * 1.5
                ]

                rectangles.push(rect)
                // s.context.rect(...rect)

            })

            s.context.fill()

        }

    })

}