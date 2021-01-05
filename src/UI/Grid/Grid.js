import React from 'react'
import './Grid.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

/**
 * 
 * @description Se crea una GRID dinámica según el arreglo enviado y las posiciones 
 * asignado en el arreglo
 * @name GRID
 * @param {[[],[]]} dato arreglo de arreglos
 * @example  
 * <Grid dato={[["a","d","f"],["b",null,"e"],["c"]]}></Grid>
 */

const Grid = (p) => {
    let informacio = null;
    if (p.dato) {
        informacio = (
            <Container className="Grid">
                {p.dato.map((f, index0) => (
                    <Row key={"row_" + index0}>
                        {f.map((c, index1) => (
                            <Col key={"col" + index0 + "_" + index1} xs={12 / f.length} sm={12 / f.length} md={12 / f.length} lg={12 / f.length} xl={12 / f.length}> {c} </Col>
                        ))}
                    </Row>
                ))}
            </Container>)
    }

    return (
        informacio
    )
}

export default Grid
