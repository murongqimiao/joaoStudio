export const drawMap = function ({ ctx, mainViewportPosition }) {
    const { map, leftDistances, topDistances, height, width, scale } = mainViewportPosition
    let _map = window.resources[map]
    if (map && _map) {
        ctx.drawImage(_map, leftDistances, topDistances, width / scale, height / scale, 0, 0, width, height)
    }
}