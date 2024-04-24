
const rangeWeapon = ["201001", "201002", "201003"]

const heroMaps = new Map()

heroMaps.set("101001", rangeWeapon)
heroMaps.set("101002", rangeWeapon)
heroMaps.set("102001", rangeWeapon)

heroMaps.set("103001", ["201006"])
heroMaps.set("104001", ["201005"])
heroMaps.set("105001", ["201004"])

export default () => {
    const keys = Array.from(heroMaps.keys())
    const heroId = keys[Math.floor(Math.random() * keys.length)]
    const weapons = heroMaps.get(heroId)
    const weaponId = weapons[Math.floor(Math.random() * weapons.length)]

    return {
        hero: heroId,
        weapon: weaponId,
        hero_skin: 1,
    }
}