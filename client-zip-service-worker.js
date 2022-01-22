self.imageTypesCount = 0;

self.addEventListener("install", (event) => {
    event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim()); // Become available to all pages
});

self.addEventListener("message", (event) => {
	self.filename = event.data[0];
	self.imageTypes = event.data[1];
});

self.addEventListener("fetch", (event) => {
	const url = new URL(event.request.url);
	// This will intercept all request with a URL starting in /downloadZip/ ;
	// you should use a meaningful URL for each download, for example /downloadZip/invoices.zip
	const [,name] = url.pathname.match(/\/downloadZip\/(.+)/i) || [,];
	if (url.origin === self.origin && name) {
		event.preventDefault();
		event.respondWith(
			new Response(`help!`)
			// event.request.formData()
			// .then(data => downloadZip(activate(data.getAll('url'))))
			// .catch(err => new Response(err.message, { status: 500 }))
	  	)
	};
});

/** generate Responses by iterating over a list of URLs */
async function* activate(urls) {
  for (const url of urls) {
	try {
      const response = await fetch(url)
      if (!response.ok)
        console.warn(`skipping ${response.status} response for ${url}`)
      else if (response.status === 204 || response.headers.get("Content-Length") === "0" || !response.body)
        console.warn(`skipping empty response for ${url}`)
      else {
        yield response;
      }
    } catch (err) {
      console.error(err)
    }

	self.imageTypesCount = self.imageTypesCount + 1;
  }
}

const downloadZip = (() => {
	"stream" in Blob.prototype || Object.defineProperty(Blob.prototype, "stream", {
		value() {
			return new Response(this).body
		}
	}), "setBigUint64" in DataView.prototype || Object.defineProperty(DataView.prototype, "setBigUint64", {
		value(e, n, i) {
			const o = Number(0xffffffffn & n),
				a = Number(n >> 32n);
			this.setUint32(e + (i ? 0 : 4), o, i), this.setUint32(e + (i ? 4 : 0), a, i)
		}
	});
	var i = e => new DataView(new ArrayBuffer(e)),
		o = e => new Uint8Array(e.buffer || e),
		a = e => Math.min(4294967295, Number(e)),
		f = e => Math.min(65535, Number(e));

	function r(e, n, i) {
		if (void 0 === n || n instanceof Uint8Array || (n = d(n)), void 0 === i || i instanceof Date || (i = new Date(i)), e instanceof File) return {
			i: n || d(e.name),
			o: i || new Date(e.lastModified),
			A: e.stream()
		};
		if (e instanceof Response) {
			const o = e.headers.get("content-disposition"),
				a = o && o.match(/;\s*filename\*?=["']?(.*?)["']?$/i),
				f = a && a[1] || `${self.filename}.${self.imageTypes[self.imageTypesCount]}`,
				r = f && decodeURIComponent(f);

			return {
				i: n || d(r),
				o: i || new Date(e.headers.get("Last-Modified") || Date.now()),
				A: e.body
			}
		}
		if (!n || 0 === n.length) throw new Error("The file must have a name.");
		if (void 0 === i) i = new Date;
		else if (isNaN(i)) throw new Error("Invalid modification date.");
		if ("string" == typeof e) return {
			i: n,
			o: i,
			A: d(e)
		};
		if (Symbol.asyncIterator in e) return {
			i: n,
			o: i,
			A: s(e)
		};
		throw new TypeError("Unsupported input format.")
	}

	function s(e) {
		const n = "next" in e ? e : e[Symbol.asyncIterator]();
		return new ReadableStream({
			async pull(e) {
				let i = 0;
				for (; e.desiredSize > i;) {
					const o = await n.next();
					if (!o.value) {
						e.close();
						break
					} {
						const n = A(o.value);
						e.enqueue(n), i += n.byteLength
					}
				}
			}
		})
	}

	function A(e) {
		return "string" == typeof e ? d(e) : e instanceof Uint8Array ? e : o(e)
	}

	function d(e) {
		return (new TextEncoder).encode(String(e))
	}
	var u = new WebAssembly.Instance(new WebAssembly.Module(Uint8Array.from(atob("AGFzbQEAAAABCgJgAABgAn9/AXwDAwIAAQUDAQACBw0DAW0CAAF0AAABYwABCpUBAkkBA38DQCABIQBBACECA0AgAEEBdiAAQQFxQaCG4u1+bHMhACACQQFqIgJBCEcNAAsgAUECdCAANgIAIAFBAWoiAUGAAkcNAAsLSQEBfyABQX9zIQFBgIAEIQJBgIAEIABqIQADQCABQf8BcSACLQAAc0ECdCgCACABQQh2cyEBIAJBAWoiAiAASQ0ACyABQX9zuAs"), (e => e.charCodeAt(0))))),
		{
			t,
			c,
			m
		} = u.exports;
	t();
	var y = 65536,
		l = o(m).subarray(y);

	function B(e, n = 0) {
		for (const i of function* (e) {
				for (; e.length > y;) yield e.subarray(0, y), e = e.subarray(y);
				e.length && (yield e)
			}(e)) l.set(i), n = c(i.length, n);
		return n
	}

	function w(e, n, i = 0) {
		const o = e.getSeconds() >> 1 | e.getMinutes() << 5 | e.getHours() << 11,
			a = e.getDate() | e.getMonth() + 1 << 5 | e.getFullYear() - 1980 << 9;
		n.setUint16(i, o, 1), n.setUint16(i + 2, a, 1)
	}

	function b(e) {
		const n = i(30);
		return n.setUint32(0, 1347093252), n.setUint32(4, 754976768), w(e.o, n, 10), n.setUint16(26, e.i.length, 1), o(n)
	}
	async function* C(e) {
		let {
			A: n
		} = e;
		if ("then" in n && (n = await n), n instanceof Uint8Array) yield n, e.u = B(n, 0), e.l = BigInt(n.length);
		else {
			e.l = 0n;
			const i = n.getReader();
			for (;;) {
				const {
					value: n,
					done: o
				} = await i.read();
				if (o) break;
				e.u = B(n, e.u), e.l += BigInt(n.length), yield n
			}
		}
	}

	function D(e, n) {
		const f = i(16 + (n ? 8 : 0));
		return f.setUint32(0, 1347094280), f.setUint32(4, e.u, 1), n ? (f.setBigUint64(8, e.l, 1), f.setBigUint64(16, e.l, 1)) : (f.setUint32(8, a(e.l), 1), f.setUint32(12, a(e.l), 1)), o(f)
	}

	function Q(e, n, f) {
		const r = i(46);
		return r.setUint32(0, 1347092738), r.setUint32(4, 755182848), r.setUint16(8, 2048), w(e.o, r, 12), r.setUint32(16, e.u, 1), r.setUint32(20, a(e.l), 1), r.setUint32(24, a(e.l), 1), r.setUint16(28, e.i.length, 1), r.setUint16(30, f ? 28 : 0, 1), r.setUint16(40, 33204, 1), r.setUint32(42, a(n), 1), o(r)
	}

	function g(e, n) {
		const a = i(28);
		return a.setUint16(0, 1, 1), a.setUint16(2, 24, 1), a.setBigUint64(4, e.l, 1), a.setBigUint64(12, e.l, 1), a.setBigUint64(20, n, 1), o(a)
	}
	return e => new Response(s(async function* (e) {
		const n = [];
		let r = 0n,
			s = 0n,
			A = 0;
		for await (const i of e) {
			yield b(i), yield i.i, yield* C(i);
			const e = i.l >= 0xffffffffn || r >= 0xffffffffn;
			yield D(i, e), n.push(Q(i, r, e)), n.push(i.i), e && (n.push(g(i, r)), r += 8n), s++, r += BigInt(46 + i.i.length) + i.l, A || (A = e)
		}
		let d = 0n;
		for (const e of n) yield e, d += BigInt(e.length);
		if (A || r >= 0xffffffffn) {
			const e = i(76);
			e.setUint32(0, 1347094022), e.setBigUint64(4, BigInt(44), 1), e.setUint32(12, 755182848), e.setBigUint64(24, s, 1), e.setBigUint64(32, s, 1), e.setBigUint64(40, d, 1), e.setBigUint64(48, r, 1), e.setUint32(56, 1347094023), e.setBigUint64(64, r + d, 1), e.setUint32(72, 1, 1), yield o(e)
		}
		const u = i(22);
		u.setUint32(0, 1347093766), u.setUint16(8, f(s), 1), u.setUint16(10, f(s), 1), u.setUint32(12, a(d), 1), u.setUint32(16, a(r), 1), yield o(u)
	}(async function* (e) {
		for await (const n of e) n instanceof File || n instanceof Response ? yield r(n) : yield r(n.input, n.name, n.lastModified)
	}(e))), {
		headers: {
			"Content-Type": "application/zip",
			"Content-Disposition": "attachment"
		}
	})
})();