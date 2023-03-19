import { Cell } from "./Cell";
import { Ship } from "./marks/Ship";
import { Miss } from "./marks/Miss";
import { Damage } from "./marks/Damage";

export class Board {

    cells = []

    initCells() {

        for (let i = 0; i < 10; i++) {

            const row = []

            for (let j = 0; j < 10; j++) {
                row.push(new Cell(this, i, j, null))
            }

            this.cells.push(row)
        }
    }

    getCopyBoard() {

        const newBoard = new Board()
        newBoard.cells = this.cells
        return newBoard
    }

    getCells(x, y) {
        return this.cells[x][y]
    }

    addShip(x, y) {
        new Ship(this.getCells(x, y))
    }

    addMiss(x, y) {
        new Miss(this.getCells(x, y))
    }

    addDamage(x, y) {
        new Damage(this.getCells(x, y))
    }
}