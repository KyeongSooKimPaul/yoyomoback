import { objectType } from "@nexus/schema"

export const Productpage = objectType({
	name: "Productpage",
	definition(t) {
		t.model.id()
        t.model.text()
		t.model.Product({ pagination: true,  ordering: true, filtering:true, })
	}
})