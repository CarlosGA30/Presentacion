export class Informacion {

    constructor(id, titulo, subtitulo, img, datos) {
        this.id = id;
        this.titulo = titulo;
        this.subtitulo = subtitulo;
        this.img = img;
        this.datos = datos; // { data [{text,img}], subinfo }
    }

    static desdeJSON(json) {
        return new Informacion(
            json.id,
            json.titulo,
            json.subtitulo,
            json.img ?? null,
            json.contenido? {
                data: json.contenido?.data ?? null,
                subinfo: (json.contenido?.subinfo || []).map(sub =>
                    Informacion.desdeJSON(sub)
                )
            }: null
        );
    }

    static listaDesdeJSON(jsonArray) {
        return jsonArray.map(item => Informacion.desdeJSON(item));
    }

}

export const datosTemaJson = fetch('js/estructuraInfo/informacion.json')
  .then(res => res.json())
  .then(json => Informacion.listaDesdeJSON(json));