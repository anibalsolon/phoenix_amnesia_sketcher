defmodule Sketcher.Mixfile do
  use Mix.Project

  def project do
    [app: :sketcher,
     version: "0.0.1",
     elixir: "~> 1.6",
     elixirc_paths: ["lib", "web"],
     compilers: [:phoenix] ++ Mix.compilers,
     deps: deps()]
  end

  def application do
    [mod: {Sketcher, []},
     extra_applications: [:phoenix, :phoenix_html, :cowboy, :logger]]
  end

  defp deps do
    [{:phoenix, "~> 1.3"},
     {:phoenix_html, "~> 2.10"},
     {:phoenix_live_reload, "~> 1.1", only: :dev},
     {:amnesia, "~> 0.2.7"},
     {:cowboy, "~> 1.1"}]
  end
end
