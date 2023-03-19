import React from "react";

const ActionsInfo = ({ shipsReady = false, canShoot = false, ready }) => {

    console.log('shipsReady = ' + shipsReady)

    if (!shipsReady) {
        return (
            <button className={'btn-ready'} onClick={ready}>Корабли готовы</button>
        )
    }

    return (
        <div>
            {canShoot ? <p>Стреляй</p> : <p>Выстрел соперника</p>}
        </div>
    )
}

export default ActionsInfo